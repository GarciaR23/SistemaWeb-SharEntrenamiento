package edu.utp.backend.features.admin.solicitud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.admin.solicitud.entities.VistaAdminSolicitud;
import edu.utp.backend.features.admin.solicitud.services.AdminSolicitudService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/solicitudes")
public class AdminSolicitudController {

    @Autowired
    private AdminSolicitudService solicitudService;

    @GetMapping
    public ResponseEntity<List<VistaAdminSolicitud>> listarSolicitudes() {
        List<VistaAdminSolicitud> lista = solicitudService.obtenerSolicitudesPendientes();
        
        if (lista.isEmpty()) {
            return ResponseEntity.noContent().build(); 
        }
        
        return ResponseEntity.ok(lista); 
    }
}