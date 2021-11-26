<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Question;
use App\Models\Option;

class DuplicatedQuestionsController extends Controller
{
    public function duplicate($id) {
        if(Auth::check()){
            $question = Question::firstWhere('id', $id);
            
            if ($question) {

                // Se a questão for do usuário logado ou for pública, duplica
                if ($question->user_id === Auth::id() || !$question->private) {

                    $new_question = $question->replicate();

                    if (!$question->duplicated_from_user) {
                        $new_question->duplicated_from_user = $question->user_id;
                    }
                    else {
                        $new_question->duplicated_from_user = $question->duplicated_from_user;
                    }

                    $new_question->private = 1;
                    $new_question->user_id = Auth::id();
                    $identifier = Hash::make('id');
                    $identifier = substr($identifier, strlen($identifier)-8, strlen($identifier));
                    $new_question->identifier = $identifier;
                    $new_question->save();

                    // Duplicando as alternativas
                    foreach ($question->options as $o) {
                        $option = new Option;
                        $option->question_id = $new_question->id;
                        $option->content = $o->content;
                        $option->correct = $o->correct;
                        $option->order = $o->order;
                        $option->timestamps = false;
                        $option->save();
                    }
                    if (isset($_GET['fromdoc'])) {
                        return redirect("/edit_quest/{$new_question->id}")->with(['duplicated' => 'Questão duplicada.', 'origin' => 'doc']);
                    }
                    else {
                        return redirect("/edit_quest/{$new_question->id}")->with('duplicated', 'Questão duplicada.');
                    }
                }
                else return redirect('/search_quests');
            }
            else return redirect('/search_quests');
        }
        else return redirect('/');
    }
}
