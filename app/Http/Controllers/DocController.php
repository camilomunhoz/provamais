<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB; 
use App\Models\User;
use App\Models\Document;
use App\Models\DocumentQuestion;

class DocController extends Controller
{
    public function rename(Request $request, $id) {
        if(Auth::check()){
            $doc = Document::firstWhere('id', $id);
            
            if($doc && $doc->user_id === Auth::id()) {
                $doc->name = $request->name;

                // Garante que não seja salvo um nome repetido. Concatena '(n)'.
                while (count(DB::select("SELECT * FROM documents WHERE user_id = $doc->user_id AND name = '$doc->name'"))) {
                    if (preg_match('/^\s\(\d\)$/', substr($doc->name, -4))) {
                        $doc->name = substr($doc->name, 0, -4).' ('.(substr($doc->name, -2, -1) + 1).')';
                    }
                    else {
                        $doc->name = $doc->name.' (1)';
                    }
                }

                trim($doc->name);                                     // Tira espaços no início e fim
                $doc->name = preg_replace('/\s+/', ' ', $doc->name);  // Tira espaços múltiplos
                if ($doc->name != '') {
                    $doc->save();
                }
                echo $doc->name;
            }
            else return redirect('/my_docs');
        }
        else return redirect('/');
    }

    public function remove($id) {
        if(Auth::check()){
            $doc = Document::firstWhere('id', $id);
            
            if($doc && $doc->user_id === Auth::id()) {
                $doc->delete();
            }
            else return redirect('/my_docs');
        }
        else return redirect('/');
    }

    public function get() {
        $docs = Document::where('user_id', Auth::id())->get();

        if (count($docs) == 0) {
            $docs[0] = 'empty';
        }

        echo json_encode($docs);
    }
    
    public function duplicate($id) {
        if(Auth::check()){
            $doc = Document::firstWhere('id', $id);
            
            if($doc && $doc->user_id === Auth::id()) {
                $new_doc = $doc->replicate();
                $doc_quest = DocumentQuestion::where('document_id', $doc->id)->get();

                // Concatena "(n)" no nome da duplicata
                while (count(DB::select("SELECT * FROM documents WHERE user_id = $doc->user_id AND name = '$new_doc->name'"))) {
                    if (preg_match('/^\s\(\d\)$/', substr($new_doc->name, -4))) {
                        $new_doc->name = substr($new_doc->name, 0, -4).' ('.(substr($new_doc->name, -2, -1) + 1).')';
                    }
                    else {
                        $new_doc->name = $new_doc->name.' (1)';
                    }
                }
                $new_doc->save();

                // Duplicando as relações
                foreach ($doc_quest as $dc) {
                    $new_doc_quest = new DocumentQuestion;
                    $new_doc_quest->question_id = $dc->question_id;
                    $new_doc_quest->document_id = $new_doc->id;
                    $new_doc_quest->order = $dc->order;
                    $new_doc_quest->save();
                }

            }
            else return redirect('/my_quests');
        }
        else return redirect('/');
    }
}