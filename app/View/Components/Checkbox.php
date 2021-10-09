<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Checkbox extends Component
{    
    private $id;
    private $name;
    public $checked;

    public function __construct($id, $name, $checked = false)
    {
        $this->id = 'c'.$id;
        $this->name = strtolower($name);
        $this->checked = $checked;
    }

    public function getId(){
        return $this->id;
    }
    public function getName(){
        return $this->name;
    }
    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.checkbox');
    }
}