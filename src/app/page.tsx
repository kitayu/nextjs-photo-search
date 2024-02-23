import { getRamdomPhotos } from '@/lib/unsplash';
import { Search } from '@/lib/component/Search';


const Home = async () => {
  const randomPhotos = await getRamdomPhotos();
  return (
    <div>
      <Search randomPhotos={randomPhotos}/>
    </div>
  );
};

export default Home;
