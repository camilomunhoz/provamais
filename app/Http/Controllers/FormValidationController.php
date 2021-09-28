<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FormValidationController extends Controller
{
    /*********** FUNÇÕES PARA VALIDAÇÃO DE FORMULÁRIO ***********/

    public function update_profile(Request $request){
            
        $user = User::find(Auth::user()->id);
        
        if($request->hasFile('profilepic') && !$request->resetpic){
            if($request->file('profilepic')->isValid()){
                print_r($request->file('profilepic')->isValid());
                $pic = $request->profilepic;
                $pic_ext = $pic->extension();
                $pic_name = md5($pic->getClientOriginalName() . strtotime("now")) . '.' . $pic_ext;
                
                $pic->move(public_path('img/users_profile_pics'), $pic_name);  
                $user->profile_pic = $pic_name;
            }
        }
        else{
            $user->profile_pic = NULL;
        }
        $user->description = $request->desc;
        $user->pix = $request->pix;

        $user->save();

        return redirect('/my_tests')->with('profile_edited','Perfil editado.');
    }
}
