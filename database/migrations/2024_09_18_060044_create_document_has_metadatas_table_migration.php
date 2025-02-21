<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('document_has_metadata', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('document_id');
            $table->unsignedBigInteger('metadata_id');
            $table->text('value')->nullable();
            $table->timestamps();

            $table->foreign('document_id')
                ->references('item_id')
                ->on('documents')
                ->onDelete('cascade');

            $table->foreign('metadata_id')
                ->references('id')
                ->on('metadata')
                ->onDelete('cascade');

            $table->unique(['document_id', 'metadata_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('document_has_metadata');
    }
};
