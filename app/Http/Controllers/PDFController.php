<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Document;
use App\Models\DocumentQuestion;
use App\Models\Question;
use App\Models\User;


class PDFController extends Controller
{
    public function pdf_doc($id) {
        if(Auth::check()){
            $doc = Document::firstWhere('id', $id);
            
            if($doc && $doc->user_id === Auth::id()) {
                $user = Auth::user();

                $doc_quest = DocumentQuestion::where('document_id', $id)->get();
                $questions = [];

                foreach($doc_quest as $dc) {
                    $question = Question::where('id', $dc->question_id)->get();
                    $question[0]->options;
                    $question[0]->order = $dc->order;
                    array_push($questions, $question[0]);
                }

                return view('pdf_doc', ['user' => $user, 'doc' => $doc, 'questions' => $questions]);
            }
            else return redirect('/my_docs');
        }
        else return redirect('/');
    }

    public function pdf_answers($id) {
        if(Auth::check()){
            $doc = Document::firstWhere('id', $id);
            
            if($doc && $doc->user_id === Auth::id()) {
                $user = Auth::user();

                $doc_quest = DocumentQuestion::where('document_id', $id)->get();
                $questions = [];
                $answers = [];

                foreach($doc_quest as $dc) {
                    $question = Question::where('id', $dc->question_id)->get();
                    $question[0]->options;
                    $question[0]->order = $dc->order;
                    array_push($questions, $question[0]);
                }

                foreach ($questions as $q) { 
                    if ($q->type == 'Dissertativa') {
                        array_push($answers, $q->answer_suggestion);
                    }
                    else if ($q->type == 'Objetiva') {
                        foreach ($q->options as $key => $option) {
                            if ($option->correct) {
                                $correct = $key;
                                break;
                            }
                        }
                        array_push($answers, $correct);
                    }
                }

                return view('pdf_answers', ['user' => $user, 'doc' => $doc, 'questions' => $questions, 'answers' => $answers]);
            }
            else return redirect('/my_docs');
        }
        else return redirect('/');
    }
}
