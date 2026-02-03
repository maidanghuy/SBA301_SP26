package org.example.assignment.service;

import lombok.RequiredArgsConstructor;
import org.example.assignment.dto.request.ASystemAccountCreateRequest;
import org.example.assignment.dto.request.ASystemAccountUpdateRequest;
import org.example.assignment.dto.response.ASystemAccountResponse;
import org.example.assignment.entity.ASystemAccount;
import org.example.assignment.mapper.SystemAccountMapper;
import org.example.assignment.repository.IASystemAccountRepository;
import org.example.assignment.service.impl.ASystemAccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ASystemAccountServiceImpl implements ASystemAccountService {

    private final IASystemAccountRepository accountRepo;

    @Override
    public List<ASystemAccountResponse> getAll(Boolean includeDeleted, String q) {
        boolean incDel = includeDeleted != null && includeDeleted;

        List<ASystemAccount> list;

        if (incDel) {
            list = (q != null && !q.isBlank())
                    ? accountRepo.findAll().stream()
                    .filter(a -> a.getAccountName() != null &&
                            a.getAccountName().toLowerCase().contains(q.toLowerCase()))
                    .toList()
                    : accountRepo.findAll();
        } else {
            list = (q != null && !q.isBlank())
                    ? accountRepo.findByDeleteFlagFalseAndAccountNameContainingIgnoreCase(q)
                    : accountRepo.findByDeleteFlagFalse();
        }

        return list.stream().map(SystemAccountMapper::toResponse).toList();
    }

    @Override
    public ASystemAccountResponse getById(Long id) {
        ASystemAccount a = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found: " + id));
        return SystemAccountMapper.toResponse(a);
    }

    @Override
    public ASystemAccountResponse create(ASystemAccountCreateRequest request) {
        String email = request.getAccountEmail().trim().toLowerCase();

        if (accountRepo.existsByAccountEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        ASystemAccount a = new ASystemAccount();
        a.setAccountName(request.getAccountName().trim());
        a.setAccountEmail(email);
        a.setAccountRole(request.getAccountRole().trim());
        a.setAccountPassword(request.getAccountPassword()); // demo: plain text
        a.setCreatedBy(request.getCreatedBy());
        a.setDeleteFlag(false);

        return SystemAccountMapper.toResponse(accountRepo.save(a));
    }

    @Override
    public ASystemAccountResponse update(Long id, ASystemAccountUpdateRequest request) {
        ASystemAccount a = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found: " + id));

        a.setAccountName(request.getAccountName().trim());
        a.setAccountRole(request.getAccountRole().trim());
        a.setUpdatedBy(request.getUpdatedBy());

        // password optional
        if (request.getAccountPassword() != null && !request.getAccountPassword().isBlank()) {
            a.setAccountPassword(request.getAccountPassword());
        }

        return SystemAccountMapper.toResponse(accountRepo.save(a));
    }

    @Override
    public ASystemAccountResponse updateDeleteFlag(Long id, Boolean deleteFlag) {
        ASystemAccount a = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found: " + id));

        a.setDeleteFlag(Boolean.TRUE.equals(deleteFlag));
        return SystemAccountMapper.toResponse(accountRepo.save(a));
    }
}
