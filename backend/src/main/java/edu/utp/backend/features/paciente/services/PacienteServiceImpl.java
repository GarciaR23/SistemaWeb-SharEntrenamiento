package edu.utp.backend.features.paciente.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.paciente.dtos.ContactoEmergenciaDto;
import edu.utp.backend.features.paciente.dtos.PacienteDto;
import edu.utp.backend.features.paciente.dtos.ProtocoloEmergenciaDto;
import edu.utp.backend.features.paciente.dtos.SensibilidadPacienteDto;
import edu.utp.backend.features.paciente.entities.ContactoEmergencia;
import edu.utp.backend.features.paciente.entities.Paciente;
import edu.utp.backend.features.paciente.entities.ProtocoloEmergencia;
import edu.utp.backend.features.paciente.entities.SensibilidadPaciente;
import edu.utp.backend.features.paciente.repositories.ContactoEmergenciaRepository;
import edu.utp.backend.features.paciente.repositories.PacienteRepository;
import edu.utp.backend.features.paciente.repositories.ProtocoloEmergenciaRepository;
import edu.utp.backend.features.paciente.repositories.SensibilidadPacienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;
    private final ProtocoloEmergenciaRepository protocoloEmergenciaRepository;
    private final ContactoEmergenciaRepository contactoEmergenciaRepository;
    private final SensibilidadPacienteRepository sensibilidadPacienteRepository;

    @Override
    public List<PacienteDto> findAll() {
        return pacienteRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<PacienteDto> findByIdTutor(Integer idTutor) {
        return pacienteRepository.findByIdTutor(idTutor)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public PacienteDto findById(Integer id) {
        return pacienteRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado: " + id));
    }

    @Override
    @Transactional
    public PacienteDto create(PacienteDto request) {
        Paciente paciente = new Paciente();
        apply(paciente, request);
        return toDto(pacienteRepository.save(paciente));
    }

    @Override
    @Transactional
    public ProtocoloEmergenciaDto crearProtocoloEmergencia(
            Integer idPaciente,
            ProtocoloEmergenciaDto request) {

        ProtocoloEmergencia protocolo = new ProtocoloEmergencia();
        protocolo.setIdPaciente(idPaciente);
        protocolo.setDescripcion(request.descripcion());

        ProtocoloEmergencia guardado = protocoloEmergenciaRepository.save(protocolo);

        return new ProtocoloEmergenciaDto(
                guardado.getIdProtocolo(),
                guardado.getIdPaciente(),
                guardado.getDescripcion());
    }

    @Override
    @Transactional
    public ContactoEmergenciaDto crearContactoEmergencia(
            Integer idPaciente,
            ContactoEmergenciaDto request) {

        ContactoEmergencia contacto = new ContactoEmergencia();
        contacto.setIdPaciente(idPaciente);
        contacto.setNombreContacto(request.nombreContacto());
        contacto.setTelefono(request.telefono());
        contacto.setRelacion(request.relacion());

        ContactoEmergencia guardado = contactoEmergenciaRepository.save(contacto);

        return new ContactoEmergenciaDto(
                guardado.getIdContacto(),
                guardado.getIdPaciente(),
                guardado.getNombreContacto(),
                guardado.getTelefono(),
                guardado.getRelacion());
    }

    @Override
    @Transactional
    public SensibilidadPacienteDto crearSensibilidadPaciente(
            Integer idPaciente,
            SensibilidadPacienteDto request) {

        SensibilidadPaciente sensibilidad = new SensibilidadPaciente();
        sensibilidad.setIdPaciente(idPaciente);
        sensibilidad.setTipoSensibilidad(request.tipoSensibilidad());

        SensibilidadPaciente guardado = sensibilidadPacienteRepository.save(sensibilidad);

        return new SensibilidadPacienteDto(
                guardado.getIdSensibilidad(),
                guardado.getIdPaciente(),
                guardado.getTipoSensibilidad());
    }

    @Override
    @Transactional
    public PacienteDto update(Integer id, PacienteDto request) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado: " + id));

        apply(paciente, request);

        return toDto(pacienteRepository.save(paciente));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        pacienteRepository.deleteById(id);
    }

    private void apply(Paciente paciente, PacienteDto request) {
        paciente.setIdTutor(request.idTutor());
        paciente.setNombreCompleto(request.nombreCompleto());
        paciente.setUrlImagenPaciente(request.urlImagenPaciente());
        paciente.setCondicion(request.condicion());
        paciente.setGradoAutismo(request.gradoAutismo());
        paciente.setGenero(request.genero());
        paciente.setEdad(request.edad());
        paciente.setDistrito(request.distrito());
        paciente.setDireccion(request.direccion());
    }

    private PacienteDto toDto(Paciente paciente) {
        return new PacienteDto(
                paciente.getIdPaciente(),
                paciente.getIdTutor(),
                paciente.getNombreCompleto(),
                paciente.getUrlImagenPaciente(),
                paciente.getCondicion(),
                paciente.getGradoAutismo(),
                paciente.getGenero(),
                paciente.getEdad(),
                paciente.getDistrito(),
                paciente.getDireccion());
    }
}