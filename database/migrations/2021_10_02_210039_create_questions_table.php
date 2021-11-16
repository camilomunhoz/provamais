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
            $table->foreignId('user_id')->constrained();
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('identifier');
            $table->string('type');
            $table->boolean('private');
            $table->string('content');
            $table->longText('statement');
            $table->string('image')->nullable();
            $table->tinyInteger('n_lines')->nullable();
            $table->text('answer_suggestion')->nullable();
            $table->longText('other_terms')->nullable();
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
