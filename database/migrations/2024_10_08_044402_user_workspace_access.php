<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_workspace_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->uuid('workspace_id');
            $table->foreign('workspace_id')->references('item_id')->on('workspaces')->onDelete('cascade');
            $table->string('role'); // 'viewer' or 'editor'
            $table->timestamps();

            $table->unique(['user_id', 'workspace_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_workspace_access');
    }
};
