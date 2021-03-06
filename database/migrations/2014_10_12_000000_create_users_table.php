<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('password');
            $table->string('cpf');
            $table->string('pix')->nullable();
            $table->string('description', 1024)->nullable();
            $table->string('profile_pic')->nullable();
            $table->string('created_at')->nullable();
            $table->string('updated_at')->nullable();
        });

        DB::table('users')->insert(['name' => 'ghost', 'email' => 'ghost', 'password' => 'ghost', 'cpf' => 'ghost']);

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
