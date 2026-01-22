import { Helmet } from "react-helmet-async";
import { Leaf } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Tentang - Bank Data Pohon</title>
        <meta name="description" content="Tentang Bank Data Pohon dan misi pelestarian lingkungan." />
      </Helmet>

      <div className="bg-gradient-nature">
        <main className="container py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Tentang Kami
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">Bank Data Pohon</h1>
            <p className="text-muted-foreground mb-6">
              Bank Data Pohon adalah platform yang dirancang untuk mencatat, memantau,
              dan melaporkan data pohon di wilayah Anda. Kami berkolaborasi dengan OPD
              dan komunitas lokal untuk mendukung program penghijauan dan pelestarian lingkungan.
            </p>

            <section className="text-left space-y-4">
              <p>
                <strong>Misi:</strong> Mengumpulkan data pohon yang akurat untuk membantu
                pengambilan keputusan lingkungan dan pelestarian alam.
              </p>
              <p>
                <strong>Visi:</strong> Menciptakan ekosistem data yang mendukung lingkungan
                yang lebih hijau dan berkelanjutan untuk generasi mendatang.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default About;
