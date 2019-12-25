declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
//允许导入less
declare module '*.less' {
  const content: any;
  export default content;
}
//允许导入css
declare module '*.css' {
  const content: any;
  export default content;
}
//允许导入json
declare module "*.json" {
  const value: any;
  export default value;
}