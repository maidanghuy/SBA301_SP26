package com.de180293.pe_sba301_sp25_be_de180293.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Role attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public Role convertToEntityAttribute(Integer dbData) {
        return Role.fromValue(dbData);
    }
}