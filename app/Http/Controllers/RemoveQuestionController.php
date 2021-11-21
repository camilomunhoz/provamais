<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Question;

class RemoveQuestionController extends Controller
{
    public function remove_quest($id) {
        if(Auth::check()){
            $question = Question::firstWhere('id', $id);
            
            if($question && $question->user_id === Auth::id()) {
                $question->delete();
                // return back();
            }
            else return redirect('/my_quests');
        }
        else return redirect('/');
    }
}
