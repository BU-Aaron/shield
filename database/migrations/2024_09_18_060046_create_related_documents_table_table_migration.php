<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('related_documents', function (Blueprint $table) {
            $table->id();
            // Change foreignId to unsignedInteger since documents use item_id as primary key
            $table->uuid('document_id');
            $table->uuid('related_document_id');
            $table->timestamps();

            // Define foreign keys explicitly to reference 'item_id' in 'documents'
            $table->foreign('document_id')
                ->references('item_id')
                ->on('documents')
                ->onDelete('cascade');

            $table->foreign('related_document_id')
                ->references('item_id')
                ->on('documents')
                ->onDelete('cascade');

            $table->unique(['document_id', 'related_document_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('related_documents');
    }
};
