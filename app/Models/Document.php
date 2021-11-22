<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    public function questions() {
        return $this->belongsToMany(Question::class);
    }
    public function header_image(){
        return $this->belongsTo(HeaderImage::class);
    }
    public function instruction(){
        return $this->belongsTo(Instruction::class);
    }
}
