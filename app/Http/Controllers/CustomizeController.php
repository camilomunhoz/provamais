<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\HeaderImage;
use App\Models\Instruction;
use App\Models\Document;
use App\Models\User;


class CustomizeController extends Controller
{
    public function store_image(Request $request) { // sleep(2);
        
        if($request->hasFile('image') && $request->image_flag){
            if($request->file('image')->isValid()){
                $header_img = new HeaderImage();

                $img = $request->image;
                $img_ext = $img->extension();
                $img_name = md5($img->getClientOriginalName() . strtotime("now")) . '.' . $img_ext;
                $img->move(public_path('img/headers'), $img_name);

                $img_client_name = $img->getClientOriginalName();
                
                $header_img->name = $img_name;
                $header_img->client_name = $img_client_name;
                $header_img->user_id = Auth::user()->id;
                $header_img->timestamps = false;
                $header_img->save();
            }
        }
        $header_imgs = HeaderImage::where('user_id', Auth::user()->id)->get();
        echo json_encode($header_imgs);

    }

    public function remove_image($id) {
        if(Auth::check()){
            $header_img = HeaderImage::firstWhere('id', $id);
            
            if($header_img && $header_img->user_id === Auth::id()) {

                // Selecionando os documentos que estão usando a imagem e trocando pro padrão
                $documents = Document::where('header_image_id', $header_img->id)->get();
                foreach ($documents as $doc) {
                    $doc->header_image_id = 1;
                    $doc->save();
                }

                $header_img->delete();
            }
            else return redirect('/my_quests');
        }
        else return redirect('/');
    }

    public function store_instruction(Request $request) { // sleep(2);
        
        $instruction = new Instruction();
        $instruction->user_id = Auth::user()->id;
        $instruction->name = $request->name;
        trim($instruction->name);                                             // Tira espaços no início e fim
        $instruction->name = preg_replace('/\s+/', ' ', $instruction->name);  // Tira espaços múltiplos
        $instruction->instructions = $request->instructions;
        $instruction->timestamps = false;
        $instruction->save();

        $instructions = Instruction::where('user_id', Auth::user()->id)->get();
        echo json_encode($instructions);

    }

    public function remove_instruction($id) {
        if(Auth::check()){
            $instruction = Instruction::firstWhere('id', $id);
            
            if($instruction && $instruction->user_id === Auth::id()) {
                
                // Selecionando os documentos que estão usando a instrução e trocando pro padrão
                $documents = Document::where('instruction_id', $instruction->id)->get();
                foreach ($documents as $doc) {
                    $doc->instruction_id = 1;
                    $doc->save();
                }

                $instruction->delete();
            }
            else return redirect('/my_quests');
        }
        else return redirect('/');
    }
}
