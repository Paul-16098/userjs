interface bookinfo {
  pageType: number;
  pageVer: string;
  siteName: string;
  site: string;
  articleid: string;
  chapterid: string;
  articlename: string;
  chaptername: string;
  index_page: string;
  sortName: string;
  sortUrl: string;
  author: string;
  preview_page: string;
  next_page: string;
}
declare const bookinfo: bookinfo;
declare function addbookcase(aid: any, cid: any): void;
