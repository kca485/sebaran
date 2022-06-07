import { createClient } from '@supabase/supabase-js';
import proj4 from 'proj4';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseApiKey);

export async function getFeatures() {
  const { data, error } = await supabase.from('sebaran').select('*');
  if (error) {
    throw new Error(error.message);
  }

  const features: GeoJSON.Feature[] = data.reduce((arr, row) => {
    if (row.x && row.y) {
      const c = proj4(
        '+proj=utm +zone=49 +south',
        'EPSG:4326',
        [parseInt(row.x, 10), parseInt(row.y, 10)],
      );
      const feature = {
        type: 'Feature',
        properties: {
          nama: row.nama,
          dusun: row.dusun,
          desa: row.desa,
          kecamatan: row.kecamatan,
          jenis: row.jenis,
          status: row.status,
          potensi: row.potensi,
          surveyor: row.surveyor,
          referensi: row.referensi,
        },
        geometry: {
          type: 'Point',
          coordinates: [c[1], c[0]],
        },
      };
      arr.push(feature);
    }

    return arr;
  }, []);

  return features;
}

export default supabase;
