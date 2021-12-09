<template>
    <div class="error" v-else-if="res === ''">
    <div class="box">
      <span class="error-text">
        You have error with MySQL connection.
      </span>
      <p>
        Check your connection and try again. 
        If error is returned, you should contact 
         with server administrator.
      </p>
      <button type="submit"><a href="/">Restart page.</a></button>
    </div>
  </div>
</template>