import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Auth,signInWithEmailAndPassword,signOut,AuthErrorCodes } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  claveIngresada:any
  user$ : any

  constructor(private auth:Auth,private toast:ToastController,private loadController:LoadingController, private navCtrl:NavController) { }

  login(email:string,password:string)
  {
    //ESTO ES PELIGROSO, BAJO NINGUNA CIRCUNSTANCIA SE DEBE GUARDAR LA CLAVE DEL USUARIO
    //DEBIDO A LA APLICACION, ES NECESARIO
    localStorage.setItem('clave',password)
    return signInWithEmailAndPassword(this.auth,email,password)
  }

  async logout()
  {
    const loading = await this.loadController.create({
      message: 'Cerrando Sesión...',
      showBackdrop: true,
      spinner: "lines"
    });
    loading.present();

    signOut(this.auth).then(() => {
      setTimeout(() => {
        this.navCtrl.navigateRoot('/login');
        loading.dismiss();
      }, 2000);
    })
  }

  obtenerError(error:any) {
    let mensaje = 'Ocurrió un error';

    switch (error.code)
    {
      case AuthErrorCodes.EMAIL_EXISTS:
        mensaje = "Este correo ya existe!"
        break;
      case AuthErrorCodes.USER_DELETED:
        mensaje = "No se encontro el usuario"
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        mensaje = "Asegurese de ingresar un mail valido!"
        break;
      default:
        mensaje = "Se produjo un error!";
        break;
    }
  
    return mensaje;
  }

  async MostrarToast(encabezado:string,mensaje:string,color:string,icono:string)
  {
    const toast = await this.toast.create({
      header:encabezado,
      message: mensaje,
      duration: 2500,
      position: 'bottom',
      color: color,
      icon: icono
    });

    await toast.present();
  }
}
