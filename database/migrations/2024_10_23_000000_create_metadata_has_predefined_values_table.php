<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('metadata_has_predefined_values', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('metadata_id');
            $table->string('predefined_value');
            $table->timestamps();

            $table->foreign('metadata_id')
                ->references('id')
                ->on('metadata')
                ->onDelete('cascade');

            // Specify a shorter name for the unique index
            $table->unique(['metadata_id', 'predefined_value'], 'meta_predef_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('metadata_has_predefined_values');
    }
};
