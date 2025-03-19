import DownloadReport from "./_components/DownloadReport";
import UploadExcel from "./_components/UploadExcel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-100 p-4">
      <UploadExcel />
      <DownloadReport />
    </div>
  );
}
