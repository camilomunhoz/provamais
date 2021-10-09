<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;
    
    // Afirma a relação 1:N de subject-question
    public function questions(){
        return $this->hasMany(Question::class);
    }
}
