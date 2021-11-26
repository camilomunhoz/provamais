<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;
use App\Models\Subject;
use App\Models\Question;
use App\Models\Document;
use App\Models\DocumentQuestion;
use App\Models\FavoriteQuestion;
use App\Models\HeaderImage;
use App\Models\Instruction;

class ViewController extends Controller
{
    /*********** FUNÇÕES PARA EXIBIÇÃO DAS VIEWS ***********/

    // Index (página inicial)
    public function index(){
        return view('welcome');
    }
    
    // View "Meus documentos"
    public function my_docs(){
        if(Auth::check()){
            $user = Auth::user();
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }
            $docs = Document::where('user_id', $user->id)->get();
            if(count($docs) == 0) {
                $docs[0] = 'empty';
            }
            return view('my_docs', ['user' => $user, 'docs' => $docs]);
        }
        return redirect('/');
    }

    // View "Criar documento"
    public function create_doc(){
        if(Auth::check()){
            $user = Auth::user();

            // Selecionando as questões favoritas
            $favorites = FavoriteQuestion::where('user_id', $user->id)->get();

            // Selecionando as disciplinas
            $subjects = Subject::all();

            // Selecionando as imagens de cabeçalho
            $user->header_images;

            // Selecionando as instruções
            $user->instructions;

            return view('create_doc', ['user' => $user, 'subjects' => $subjects, 'favorites' => $favorites]);
        }
        return redirect('/');
    }

    // View "Editar documento"
    public function edit_doc($id){
        if(Auth::check()){
            $document = Document::where('id', $id)->get();
            $doc_quest = DocumentQuestion::where('document_id', $id)->get();
            $questions = [];

            foreach ($doc_quest as $dc) {
                $question = Question::where('id', $dc->question_id)->get();
                $question[0]->options;
                $question[0]->order = $dc->order;
                array_push($questions, $question[0]);
            }

            $user = Auth::user();

            // Selecionando as disciplinas
            $subjects = Subject::all();
            
            // Selecionando as imagens de cabeçalho
            $user->header_images;

            // Selecionando as instruções
            $user->instructions;

            return view('edit_doc', ['user' => $user, 'subjects' => $subjects, 'questions' => $questions, 'document' => $document[0]]);
        }
        return redirect('/');
    }

    // View "Minhas questões"
    public function my_quests(){
        if(Auth::check()){
            $user = Auth::user();

            $sql = "SELECT * FROM questions WHERE user_id = $user->id";

            // Selecionando as favoritas
            $favorites = FavoriteQuestion::where('user_id', $user->id)->get();

            // Incluindo as favoritas na query
            foreach ($favorites as $key => $fav) {
                if ($key == 0) $sql .= " OR (id = $fav->question_id";
                else $sql .= " OR id = $fav->question_id";
                if ($key == count($favorites)-1) $sql .= ')';
            }

            // Selecionando as questões do usuário
            $questions = Question::hydrate(DB::select($sql));

            if(count($questions) == 0) {
                $questions[0] = 'empty';
            }
            else {
                foreach ($questions as $q){
                    $q['subject_name'] = $q->subject->name;
                    $q['options'] = $q->options;

                    // Se ela não é uma duplicata, ainda tem que conferir quem é o dono pois pode ser uma favoritada
                    if (!$q->duplicated_from_user) {
                        if ($q->user_id === Auth::id()) {
                            $q->owner = 'você mesmo';
                        }
                        else {
                            $owner_name = explode(' ', $q->user->name);
                            $q->owner = $owner_name[0];
                        }
                    }
                    // Se ela é uma duplicata, é imprescindível conferir quem é o dono: o logado ou outro user
                    else {
                        $creator = User::firstWhere('id', $q->duplicated_from_user);
                        if ($creator->id === Auth::id()) {
                            $q->owner = 'você mesmo';
                        }
                        else {
                            $creator_name = explode(' ', $creator->name);
                            $q->owner = $creator_name[0];
                        }
                        $q->user->profile_pic = $creator->profile_pic;
                    }

                    if(!$q->user->profile_pic){
                        $q->user->profile_pic = 'user_pic_placeholder.png';
                    }

                    // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
                    unset($q->user['name']);
                    unset($q->user['cpf']);
                    unset($q->user['password']);
                    unset($q->user['pix']);
                    unset($q->user['email']);
                    unset($q->user['description']);
                    unset($q->user['created_at']);
                    unset($q->user['updated_at']);
                }
            }
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }

            return view('my_quests', ['user' => $user, 'questions' => $questions, 'favorites' => $favorites]);
        }
        return redirect('/');
    }

    // View "Cadastrar questão"
    public function create_quest(){
        if(Auth::check()){
            $subjects = Subject::all();
            $identifier = Hash::make('id');
            $identifier = substr($identifier, strlen($identifier)-8, strlen($identifier));
            return view('create_quest', ['subjects' => $subjects, 'identifier' => $identifier]);
        }
        return redirect('/');
    }

    // View "Editar questão"
    public function edit_quest($id){
        if(Auth::check()){
            $question = Question::firstWhere('id', $id);
            if($question->user_id === Auth::id()) {
                $subjects = Subject::all();
                $question->options;
                $identifier = $question->identifier;
                if (isset($_GET['fromdoc'])) {
                    return view('edit_quest', ['subjects' => $subjects, 'identifier' => $identifier, 'question' => $question, 'origin' => 'doc']);
                }
                else {
                    return view('edit_quest', ['subjects' => $subjects, 'identifier' => $identifier, 'question' => $question]);
                }
            }
        }
        return redirect('/');
    }

    // View "Procurar questões"
    public function search_quests(){
        if(Auth::check()){
            $user = Auth::user();

            $questions = Question::where('private', 0)->get();
            if(count($questions) == 0) {
                $questions[0] = 'empty';
            }
            else {
                foreach ($questions as $q){
                    $q['subject_name'] = $q->subject->name;
                    $q['options'] = $q->options;
                    
                    $q['options'] = $q->options;

                    if ($q->user->name == $user->name) {
                        $q->owner = 'você mesmo';
                    }
                    else {
                        $username = explode(' ', $q->user->name);
                        $q->owner = $username[0];
                    }

                    if(!$q->user->profile_pic){
                        $q->user->profile_pic = 'user_pic_placeholder.png';
                    }

                    // Retirando dados sensíveis e deixando somente 'id' e 'profile_pic'
                    unset($q->user['name']);
                    unset($q->user['cpf']);
                    unset($q->user['password']);
                    unset($q->user['pix']);
                    unset($q->user['email']);
                    unset($q->user['description']);
                    unset($q->user['created_at']);
                    unset($q->user['updated_at']);
                }
            }
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }

            // Selecionando as favoritas
            $favorites = FavoriteQuestion::where('user_id', $user->id)->get();

            // Selecionando as disciplinas
            $subjects = Subject::all();

            return view('search_quests', [
                'user' => $user,
                'questions' => $questions,
                'favorites' => $favorites,
                'subjects' => $subjects,
            ]);
        }
        return redirect('/');
    }

    // View "Editar perfil"
    public function my_profile(){
        if(Auth::check()){
            $user = Auth::user();
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }
            $n_quests = User::withCount('questions')->get();

            foreach ($n_quests as $key => $n) {
                if ($n->id == $user->id) {
                    $user['n_quests'] = $n_quests[$key]->questions_count;
                    break;
                }
            }

            return view('my_profile', ['user' => $user]);
        }
        return redirect('/');
    }

    // View "Exibir perfil"
    public function show_profile($id){
        if(Auth::check()){
            $user = User::findOrFail($id);
            $username = explode(' ', $user->name);
            $user->name = $username[0];
            if(!$user->profile_pic){
                $user->profile_pic = 'user_pic_placeholder.png';
            }
            $n_quests = User::withCount('questions')->get();

            foreach ($n_quests as $key => $n) {
                if ($n->id == $user->id) {
                    $user['n_quests'] = $n_quests[$key]->questions_count;
                    break;
                }
            }

            return view('profile', ['user' => $user]);
        }
        return redirect('/');
    }

    // View "Personalizar documentos"
    public function customization(){
        if(Auth::check()){
            $user = Auth::user();
            
            $header_imgs = HeaderImage::where('user_id', Auth::user()->id)->get();
            $instructions= Instruction::where('user_id', Auth::user()->id)->get();

            return view('customization', ['images' => $header_imgs, 'instructions' => $instructions]);
        }
        return redirect('/');
    }

    // View "Ajuda e Tutoriais"
    public function help(){
        return view('help');
    }

    // View "Esqueci minha senha"
    public function pswd_reset_request() {
        return view('password_reset');
    }

}
