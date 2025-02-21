<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_document_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->uuid('document_id');
            $table->foreign('document_id')->references('item_id')->on('documents')->onDelete('cascade');
            $table->string('role'); // 'viewer' or 'editor'
            $table->timestamps();

            $table->unique(['user_id', 'document_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_document_access');
    }
};
