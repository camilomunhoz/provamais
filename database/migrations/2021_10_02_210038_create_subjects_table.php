<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        $subject_list = [
            'Matemática',
            'Probabilidade e Estatística',
            'Ciência da computação',
            'Astronomia',
            'Física',
            'Química',
            'Geociências',
            'Biologia',
            'Bioquímica',
            'Biofísica',
            'Farmacologia',
            'Imunologia',
            'Microbiologia',
            'Parasitologia',
            'Ecologia',
            'Oceanografia',
            'Botânica',
            'Zoologia',
            'Engenharia civil',
            'Engenharia sanitária',
            'Engenharia de transportes',
            'Engenharia de minas',
            'Engenharia de materiais',
            'Engenharia química',
            'Engenharia nuclear',
            'Engenharia mecânica',
            'Engenharia de produção',
            'Engenharia naval e oceânica',
            'Engenharia aeroespacial',
            'Engenharia elétrica',
            'Engenharia biomédica',
            'Engenharia florestal',
            'Engenharia agrícola',
            'Engenharia de pesca',
            'Engenharia de alimentos',
            'Medicina',
            'Cirurgia',
            'Psiquiatria',
            'Odontologia',
            'Farmácia',
            'Enfermagem',
            'Nutrição',
            'Epidemiologia',
            'Fonoaudiologia',
            'Fisioterapia e Terapia Ocupacional',
            'Educação física',
            'Agronomia',
            'Zootecnia',
            'Medicina Veterinária',
            'Direito',
            'Administração',
            'Ciências Contábeis',
            'Economia',
            'Arquitetura e Urbanismo',
            'Biblioteconomia',
            'Arquivologia',
            'Museologia',
            'Comunicação',
            'Jornalismo e Editoração',
            'Rádio e Televisão',
            'Relações Públicas e Propaganda',
            'Serviço Social',
            'Desenho Industrial',
            'Turismo',
            'Filosofia',
            'Sociologia',
            'Antropologia',
            'Arqueologia',
            'História',
            'Geografia',
            'Psicologia',
            'Educação',
            'Ciência Política',
            'Teologia',
            'Linguística',
            'Letras',
            'Artes',
            'Música',
            'Dança',
            'Teatro',
            'Fotografia',
            'Educação Artística',
        ];

        sort($subject_list);

        foreach($subject_list as $index) {
            DB::table('subjects')->insert(['name' => $index]);
        }

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subjects');
    }
}
