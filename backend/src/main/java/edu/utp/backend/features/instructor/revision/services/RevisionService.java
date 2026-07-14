package edu.utp.backend.features.instructor.revision.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.instructor.revision.dtos.ContadorPendienteDto;
import edu.utp.backend.features.instructor.revision.dtos.FechaCriticaDto;
import edu.utp.backend.features.instructor.revision.dtos.RecienteSemanalDto;
import edu.utp.backend.features.instructor.revision.dtos.RevisionDecisionRequest;
import edu.utp.backend.features.instructor.revision.dtos.RevisionDecisionResponse;
import edu.utp.backend.features.instructor.revision.dtos.RevisionPacienteDto;
import edu.utp.backend.features.instructor.revision.repositories.RevisionRepository;
import edu.utp.backend.features.rendimiento.hoja_ruta.entities.HojaRuta;
import edu.utp.backend.features.rendimiento.hoja_ruta.enums.EstadoHoja;
import edu.utp.backend.features.rendimiento.hoja_ruta.repositories.HojaRutaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final RevisionRepository revisionRepository;
    private final HojaRutaRepository hojaRutaRepository;

    @Transactional
    public void limpiarVencidas() {
        revisionRepository.limpiarReservasVencidas();
    }

    @Transactional(readOnly = true)
    public List<RevisionPacienteDto> obtenerPacientesParaRevision(Integer idInstructor) {
        List<Object[]> results = revisionRepository.obtenerPacientesParaRevision(idInstructor);
        return results.stream()
                .map(row -> new RevisionPacienteDto(
                        ((Number) row[0]).intValue(),
                        ((Number) row[1]).intValue(),
                        (String) row[2],
                        (String) row[3],
                        ((Number) row[4]).intValue(),
                        row[5] != null ? ((java.sql.Date) row[5]).toLocalDate() : null,
                        row[6] != null ? ((java.sql.Time) row[6]).toLocalTime() : null,
                        (String) row[7],
                        (String) row[8]))
                .toList();
    }

    @Transactional(readOnly = true)
    public FechaCriticaDto obtenerFechaCritica(Integer idReserva) {
        Object[] result = revisionRepository.obtenerFechaCritica(idReserva);
        return new FechaCriticaDto(
                (String) result[0],
                (String) result[1],
                (String) result[2],
                (String) result[3],
                (String) result[4]);
    }

    @Transactional
    public RevisionDecisionResponse decidirRevision(RevisionDecisionRequest request) {
        String estado = request.aprobada() ? "aprobada" : "rechazada";
        Object[] result = revisionRepository.actualizarEstadoRevision(request.idDetalle(), estado);

        Integer idDetalle = ((Number) result[0]).intValue();
        Integer idReserva = ((Number) result[1]).intValue();

        if (request.aprobada()) {
            if (hojaRutaRepository.findByIdDetalle(idDetalle).isEmpty()) {
                HojaRuta hojaRuta = new HojaRuta();
                hojaRuta.setIdReserva(idReserva);
                hojaRuta.setIdDetalle(idDetalle);
                hojaRuta.setEstadoHoja(EstadoHoja.pendiente_envio);
                hojaRutaRepository.save(hojaRuta);
            }
        }

        return new RevisionDecisionResponse(
                idDetalle,
                idReserva,
                (String) result[2],
                result[3] != null ? ((java.sql.Timestamp) result[3]).toLocalDateTime() : null);
    }

    @Transactional(readOnly = true)
    public ContadorPendienteDto obtenerContadorPendiente(Integer idInstructor) {
        Long total = revisionRepository.contarPendientes(idInstructor);
        return new ContadorPendienteDto(total);
    }

    @Transactional(readOnly = true)
    public List<RecienteSemanalDto> obtenerRecienteSemanal(Integer idInstructor) {
        List<Object[]> results = revisionRepository.obtenerRecienteSemanal(idInstructor);
        return results.stream()
                .map(row -> new RecienteSemanalDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        (String) row[2],
                        row[3] != null ? ((java.sql.Timestamp) row[3]).toLocalDateTime() : null))
                .toList();
    }
}