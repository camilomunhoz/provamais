<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users');
            $table->foreignId('id_subject')->constrained('subjects');
            $table->string('type');
            $table->boolean('isPrivate');
            $table->string('content');
            $table->json('statement');
            $table->text('answer_suggestion')->nullable();
            $table->tinyInteger('n_lines')->nullable();
            $table->json('other_terms')->nullable();
            $table->integer('denunciations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
