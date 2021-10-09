<?php

namespace App\View\Components;

use Illuminate\View\Component;

class QuestionCard extends Component
{
    private $id;
    private $subject;
    private $content;
    private $type;

    public function __construct($id, $subject, $content, $type)
    {
        $this->id = $id;
        $this->subject = $subject;
        $this->content = $content;
        $this->type = $type;
    }

    public function getId(){
        return $this->id;
    }
    public function getSubject(){
        return $this->subject;
    }
    public function getContent(){
        return $this->content;
    }
    public function getType(){
        return $this->type;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.question-card');
    }
}
