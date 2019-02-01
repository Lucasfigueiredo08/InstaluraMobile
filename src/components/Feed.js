import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  FlatList,
  Platform,
  AsyncStorage,
  View,
  ScrollView

} from 'react-native';
import Post from './Post';
import HeaderUsuario from './HeaderUsuario';
import Api from '../services/api';
import Notificacao from '../api/Notificacao.android';
import api from '../services/api';
import { Navigation } from 'react-native-navigation';


export default class Feed extends Component {

  constructor() {
    super();
    this.state = {
      fotos: [],
    }
  }

  componentDidMount() {
    this.load();
    let uri = "/fotos/";
    if (this.props.usuario) {
      uri = `/public/fotos/${this.props.usuario}`;
    }

    Api.get(uri)
      .then(json => this.setState({ fotos: json }))
  }

  load() {
    Api.get('/fotos')
      .then(json => this.setState({ fotos: json, status: 'NORMAL' }))
      .catch(e => this.setState({ status: 'FALHA_CARREGAMENTO' }));
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
      .catch(e => {
        this.setState({ fotos: listaOriginal })
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

  verPerfilCallback(idFoto) {
    const foto = this.buscaPorId(idFoto);

    Navigation.push(this.props.componentId, {
      component: {
        name: 'navigation.playground.Feed',
        passProps: {
          usuario: foto.loginUsuario,
          fotoDePerfil: foto.urlPerfil,
          posts: this.state.fotos.length
        },
        options: {
          topBar: {
            title: {
              text: foto.loginUsuario
            }
          }
        }
      }
    });
  }

  exibeHeader() {
    if(this.props.usuario)
      return <HeaderUsuario usuario={this.props.usuario}
        fotoDePerfil={this.props.fotoDePerfil} 
        posts={this.state.fotos.length}/>
  }

  render() {
    if (this.state.status === 'FALHA_CARREGAMENTO')
      return (
        <TouchableOpacity style={styles.container} onPress={this.load.bind(this)}>
          <Text style={[styles.texto, styles.titulo]}>Ops..</Text>
          <Text style={styles.texto}>Não foi possível carregar o feed</Text>
          <Text style={styles.texto}>Toque para tentar novamente</Text>
        </TouchableOpacity>
      );
    return (
      <ScrollView>
        {this.exibeHeader()}
        <FlatList
          keyExtractor={item => item.id}
          data={this.state.fotos}
          renderItem={({ item }) =>
            <Post foto={item}
              likeCallback={this.like.bind(this)}
              comentarioCallback={this.adicionaComentario.bind(this)}
              verPerfilCallback={this.verPerfilCallback.bind(this)} />
          }
        />
      </ScrollView>
    );
  }
}

const margem = Platform.OS == 'ios' ? 100 : 100;
const styles = StyleSheet.create({
  container: {
    marginTop: margem
  },
});
