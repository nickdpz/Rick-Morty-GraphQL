import React, { Component } from 'react';
import '../assets/styles/Home.css';
import CharacterItem from '../components/CharacterItem';
import { Pagination } from '@material-ui/lab';
import api from '../utils/api';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import CharacterDetails from '../components/CharacterDetails';
const override = css`
	display: block;
	margin: 0 auto;
	border-color: blue;
`;
//import logo from '../assets/images/start_wars_logo.svg';

class Home extends Component {
	state = {
		loading: true,
		error: false,
		characters: [],
		charactersCurrent: [],
		pages: [1],
		page: 1,
		count: 1,
		characterId: null,
		characterName: null,
		isActivePopup: false,
	};
	fetchData = async (value = 1) => {
		this.setState({ loading: true, error: null });
		try {
			let data = await api.getCharacters(value);
			this.setState({
				loading: false,
				error: null,
				count: data.characters.info.pages,
				charactersCurrent: data.characters.results,
				page: value,
			});
		} catch (error) {
			this.setState({ loading: false, error: error, page: 1 });
		}
	};

	handleChange = (event, value) => {
		this.fetchData(value);
	};

	componentDidMount() {
		this.fetchData();
	}

	handlePopup = (id, name) => {
		this.setState({
			isActivePopup: true,
			characterId: id,
			characterName: name,
		});
	};

	handlePopupClose = () => {
		this.setState({ isActivePopup: false });
	};

	render() {
		return (
			<>
				{this.state.isActivePopup && (
					<CharacterDetails
						id={this.state.characterId}
						handleClose={this.handlePopupClose}
						name={this.state.characterName}
					/>
				)}
				<main className="container-full">
					<section className="title-page-container">
						<h1 className="title-page">Rick And Morty Characters</h1>
						{/* <div className="hero-image" width="378">
						<img src={logo} alt="start wars logo" />
					</div> */}
					</section>
					<div className="sweet-loading mt-4">
						<ClipLoader
							css={override}
							size={150}
							color={'#123abc'}
							loading={this.state.loading}
						/>
					</div>
					{!this.state.loading && (
						<>
							<section className="container-all-characters container-fluid">
								<div className="container-characters">
									{this.state.charactersCurrent.map((item) => (
										<CharacterItem
											key={item.id}
											character={item}
											handlerName={this.handlePopup}
										></CharacterItem>
									))}
								</div>
							</section>
							<section className="py-4 d-flex justify-content-center">
								<Pagination
									count={this.state.count}
									page={this.state.page}
									onChange={this.handleChange}
								/>
							</section>
						</>
					)}
				</main>
			</>
		);
	}
}

export default Home;
