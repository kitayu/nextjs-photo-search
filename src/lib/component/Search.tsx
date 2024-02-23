'use client';

import { Photo, PhotoSearchResponse } from '@/lib/type';
import {
	FunctionComponent,
	useState,
	useTransition
} from 'react';
import { VscSearch } from 'react-icons/vsc';
import { Loading } from './Loading';
import { Photolist } from './PhotoList';

const PhotoListWrapper: FunctionComponent<{
	loading: boolean;
	searchedPhotos: Photo[] | null;
	randamPhotos: Photo[];
}> = ({ loading, searchedPhotos, randamPhotos }) => {
	if (loading) {
		return <Loading />;
	}

	if (searchedPhotos) {
		return <Photolist photos={searchedPhotos} />
	}

	return <Photolist photos={randamPhotos} />;
};

export const Search: FunctionComponent<{
	randomPhotos: Photo[];
}> = ({ randomPhotos }) => {
	const [query, setQuery] = useState<string | null>(null);
	const [searching, setSearching] = useState(false);
	const [searchedPhotos, setSearchedPhotos] = useState<Photo[] | null>(null);
	const [loading, startTransition] = useTransition();
	return (
		<div>
			<div className="my-8 flex justify-center">
				<input
					className="w-96 mr-4 p-2 bg-gray-700"
					value={query ?? ''}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
				/>
				<button
					className="bg-gray-700 py-2 px-4"
					onClick={async() => {
						try {
							setSearching(true);
							const response = await fetch(
								`http://localhost:3000/api/search`,
								{
									method: 'POST',
									body: JSON.stringify({
										query
									}),
									headers: {
										'Content-Type': 'application/json'
									}
								}
							);

							if (!response.ok) {
								throw response;
							}

							const json: PhotoSearchResponse = await response.json();
							startTransition(() => {
								setSearchedPhotos(json.results);
							});
						} catch (error) {
							console.log(error);
							alert(
								'検索中にエラーが発生しました'
							);
							setSearchedPhotos([]);
						} finally {
							setSearching(false);
						}

					}}
				>
					<VscSearch />
				</button>
			</div>
			<PhotoListWrapper
				loading={searching || loading}
				searchedPhotos={searchedPhotos}
				randamPhotos={randomPhotos}
			/>
		</div>
	);
};