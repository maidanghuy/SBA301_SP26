package org.example.orchid.service.impl;

import org.example.orchid.entity.Orchid;

import java.util.List;

public interface OrchidService {
    public List<Orchid> findAll();
    public Orchid findById(Long id);
    List<Orchid> search(String category, String q, String sort);
    public Orchid save(Orchid orchid);
    public void deleteById(Long id);
}
