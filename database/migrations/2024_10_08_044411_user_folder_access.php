<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_folder_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->uuid('folder_id');
            $table->foreign('folder_id')->references('item_id')->on('folders')->onDelete('cascade');
            $table->string('role'); // 'viewer' or 'editor'
            $table->timestamps();

            $table->unique(['user_id', 'folder_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_folder_access');
    }
};
