export interface RegistroTutorResponse {
    success: boolean;
    message: string;
    token: string;
    usuario: {
        idUsuario: number;
        email: string;
        rol: string;
        estadoCuenta: string;
        fechaRegistro: string;
    };
    idTutor: number;
}