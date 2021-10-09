<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    // Afirma a relação 1:N de question-option
    public function options(){
        return $this->belongsTo(Question::class);
    }
}
