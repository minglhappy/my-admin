<script setup lang="ts">
import { useChunkUpload } from '@/hooks/useChunkUpload';
import { uploadChunkApi, checkChunkApi, mergeChunksApi } from '@/api/modules/upload';

const { progress, uploading, uploadFile, abortUpload } = useChunkUpload({
  chunkSize: 2 * 1024 * 1024, // 2MB 一片（片数多一点，方便观察）
  concurrency: 3, // 同时 3 片并发
  uploadChunkApi,
  checkApi: checkChunkApi,
  mergeApi: mergeChunksApi,
});

/** 选中文件后自动开始上传 */
const handleChange = (file: any) => {
  if (file.raw) uploadFile(file.raw); // file.raw 是原生 File 对象
};
</script>

<template>
  <div class="page-container">
    <el-card header="分片上传演示">
      <el-upload :auto-upload="false" :show-file-list="false" :on-change="handleChange">
        <el-button type="primary" :loading="uploading">选择文件</el-button>
      </el-upload>

      <el-button type="danger" :disabled="!uploading" @click="abortUpload">终止上传</el-button>

      <el-progress class="mt20" :percentage="progress" :status="progress === 100 ? 'success' : ''" />

      <p class="tip">选一个 10MB 以上的文件，观察进度条和 Network 面板</p>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.tip {
  margin-top: 10px;
  color: $text-color-secondary;
  font-size: 13px;
}
</style>
