export interface RegistroInstructorResponse {
    success: boolean;
    message: string;
    usuario: {
        idUsuario: number;
        email: string;
        rol: string;
        estadoCuenta: string;
        fechaRegistro: string;
    };
    idInstructor: number;
}