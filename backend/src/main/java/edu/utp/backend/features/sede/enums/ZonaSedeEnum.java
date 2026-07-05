package edu.utp.backend.features.sede.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ZonaSedeEnum {
    Norte,
    Sur,
    Este,
    Oeste,
    Centro;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static ZonaSedeEnum fromValue(String value) {
        if (value == null) {
            return null;
        }
        try {
            return ZonaSedeEnum.valueOf(value);
        } catch (IllegalArgumentException e) {
            // Try to match ignoring case
            for (ZonaSedeEnum zona : ZonaSedeEnum.values()) {
                if (zona.name().equalsIgnoreCase(value)) {
                    return zona;
                }
            }
            throw new IllegalArgumentException("Zona no válida: " + value);
        }
    }
}
