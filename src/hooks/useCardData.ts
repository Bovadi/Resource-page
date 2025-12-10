@@ .. @@
 export interface Card {
   id: string;
   image: string;
   title: string;
   type: 'course' | 'resource';
   description?: string;
  description_long?: string;
   video_url?: string;
   test_url?: string;
+  download_url?: string;
  perfect_for?: string[];
 }