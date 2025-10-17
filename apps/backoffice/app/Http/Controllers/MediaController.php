<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Media;
use Auth;

class MediaController extends Controller {

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:jpg,jpeg,png|max:2048',
        ]);

        $file = $request->file('file');
        $fileName = time().'_'.$file->getClientOriginalName();
        $filePath = $file->storeAs('uploads', $fileName, 'public');
        $fileSize = $file->getSize();

        $media = Media::create([
            'file_name' => $fileName,
            'file_path' => '/storage/' . $filePath,
            'file_type' => $file->getMimeType(),
            'file_size' => $fileSize,
            'user_id' => Auth::id()
        ]);

        if($request->has('mediable_type') && $request->has('mediable_id')) {
            $media->update([
                'mediable_id' => $request->mediable_id,
                'mediable_type' => $request->mediable_type,
            ]);
        }

        return response()->json(['media' => $media], 201);
    }

}
