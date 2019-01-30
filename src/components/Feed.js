import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  FlatList,
  Platform,
  AsyncStorage
} from 'react-native';
import Post from './Post';
import Api from '../services/api';
import Notificacao from '../api/Notificacao.android';

export default class Feed extends Component {

  constructor() {
    super();
    this.state = {
      fotos: [],
    }
  }

  componentDidMount() {
    Api.get('/fotos')
    .then(json => this.setState({ fotos: json }))
  }


  buscaPorId(idFoto) {
    return this.state.fotos
      .find(foto => foto.id === idFoto)
  }

  atualizaFotos(fotoAtualizada) {
    const fotos = this.state.fotos
      .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto)
    this.setState({ fotos })
  }

  like(idFoto) {
    const listaOriginal = this.state.fotos;
    const foto = this.buscaPorId(idFoto);

    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {

        let novaLista = []
        if (!foto.likeada) {
          novaLista = [
            ...foto.likers,
            { login: usuarioLogado }
          ]
        } else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado
          })
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista
        }

        this.atualizaFotos(fotoAtualizada);
      });

     Api.post(`/fotos/${idFoto}/like`)
      .catch(e => 
        {
          this.setState({fotos: listaOriginal})
          Notificacao.exibe('Ops..', 'Algo deu errado!')
        });
  }

  adicionaComentario(idFoto, valorComentario, inputComentario) {
    if (valorComentario === '')
      return;

    const foto = this.buscaPorId(idFoto);
    const comentario = {
      texto: valorComentario
    };
     Api.post(`/fotos/${idFoto}/comment`, comentario)
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista
        }
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(e => Notificacao.exibe('Ops!', 'Não foi possivel adicionar um novo comentário.'));
  }

  render() {
    return (

      <FlatList style={styles.container}
        keyExtractor={item => item.id}
        data={this.state.fotos}
        renderItem={({ item }) =>
          <Post foto={item}
            likeCallback={this.like.bind(this)}
            comentarioCallback={this.adicionaComentario.bind(this)} />
        }
      />
    );
  }
}

const margem = Platform.OS == 'ios' ? 20 : 0;
const styles = StyleSheet.create({
  container: {
    marginTop: margem
  },
});
