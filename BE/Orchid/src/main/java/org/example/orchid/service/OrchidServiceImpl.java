package org.example.orchid.service;

import lombok.RequiredArgsConstructor;
import org.example.orchid.entity.Orchid;
import org.example.orchid.repository.ICategoryRepository;
import org.example.orchid.repository.IOrchidRepository;
import org.example.orchid.service.impl.OrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrchidServiceImpl implements OrchidService {

    @Autowired
    private final IOrchidRepository orchidRepository;

    @Override
    public List<Orchid> findAll() {
        return Collections.unmodifiableList(
                orchidRepository.findAll(activeOnlySpec(), Sort.by(Sort.Direction.DESC, "id"))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Orchid findById(Long id) {
        return orchidRepository.findByIdAndDeleteFlagIsFalse(id)
                .orElseThrow(() ->
                        new RuntimeException("Orchid not found or has been deleted, id = " + id)
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Orchid> search(String category, String q, String sort) {

        Specification<Orchid> spec = Specification.where(activeOnlySpec());

        if (category != null && !category.isBlank()) {
            spec = spec.and(categorySpec(category));
        }

        if (q != null && !q.isBlank()) {
            spec = spec.and(keywordSpec(q));
        }

        Sort sortObj = parseSort(sort);

        return orchidRepository.findAll(spec, sortObj);
    }

    @Override
    @Transactional
    public Orchid save(Orchid orchid) {

        if (orchid.getDeleteFlag() != null && orchid.getDeleteFlag()) {
            throw new RuntimeException("Cannot save a deleted orchid");
        }

        return orchidRepository.save(orchid);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        Orchid orchid = findById(id);
        orchid.setDeleteFlag(true);
        orchidRepository.save(orchid);
    }

    private Specification<Orchid> activeOnlySpec() {
        return (root, query, cb) -> cb.isFalse(root.get("deleteFlag"));
    }

    private Specification<Orchid> categorySpec(String categoryName) {
        if (categoryName == null || categoryName.isBlank()) return null;
        return (root, query, cb) ->
                cb.equal(root.get("category").get("name"), categoryName);
    }

    private Specification<Orchid> keywordSpec(String q) {
        if (q == null || q.isBlank()) return null;

        String like = "%" + q.trim().toLowerCase() + "%";

        return (root, query, cb) -> {
            List<Predicate> ors = new ArrayList<>();
            ors.add(cb.like(cb.lower(root.get("orchidName")), like));
            ors.add(cb.like(cb.lower(root.get("description")), like));
            return cb.or(ors.toArray(new Predicate[0]));
        };
    }

    private Sort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "orchidName"); // default
        }

        String[] parts = sort.split(",");
        String field = parts[0].trim();

        Sort.Direction direction = Sort.Direction.ASC;
        if (parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())) {
            direction = Sort.Direction.DESC;
        }

        // whitelist để tránh user sort bậy field
        if (!List.of("orchidName", "isSpecial", "categoryId", "id").contains(field)) {
            field = "orchidName";
        }

        return Sort.by(direction, field);
    }
}
