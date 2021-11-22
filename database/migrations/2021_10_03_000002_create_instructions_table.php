<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstructionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('instructions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('instructions');
        });

        DB::table('instructions')->insert(['user_id' => '1', 'name' => 'Padrão', 'instructions' => '["Leia e realize as questões com atenção;","Utilize caneta esferográfica azul ou preta;","Ao término da prova, levante a mão e aguarde o(a) professor(a);"]']);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('instructions');
    }
}
