import { useState, useEffect } from "react";
import { db, auth } from "./firebaseconnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./app.css";
import { async } from "@firebase/util";
function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [post, setPosts] = useState([]);
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((post) => {
          listaPost.push({
            id: post.id,
            titulo: post.data().titulo,
            autor: post.data().autor,
          });
        });
        setPosts(listaPost);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setUserDetail({
            id: user.id,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function enviarForm() {
    /*
    await setDoc(doc(db, "users", "123"), {
      título: titulo,
      autor: autor,
    })
      .then(() => {
        alert("dados cadastrados no banco de dados");
      })
      .catch((error) => {
        console.log(error);
      });
      */

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("dados cadastrados");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        alert("erro no cadastro");
      });
  }
  async function exibirDB() {
    /*
    const postRef = doc(db, "posts", "BBpcFBldh7fVdYKEuPlM");

    await getDoc(postRef)
      .then((snapshot) => {
        setAutor(snapshot.data().autor);
        setTitulo(snapshot.data().titulo);
      })
      .catch((error) => {
        alert("erro");
      });
      */

    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        alert("erro");
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("post editado");
        setAutor("");
        setTitulo("");
        setIdPost("");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("post deletado com sucesso");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("usuário cadastrado");
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        if (error.code === "auth/weak-pasword") {
          alert("senha muito fraca");
        } else if (error.code === "auth/email-already-in-use") {
          alert("e-mail já cadastrado");
        }
      });
  }
  async function logIn() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert("log in feito com sucesso");
        setUserDetail({
          id: value.user.id,
          email: value.user.id,
        });
        setUser(true);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function logOut() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  return (
    <div className="app">
      <h1>projeto firebase</h1>
      {user && (
        <div>
          <h3>Seja bem-vindo(a) de volta.</h3>
          <button onClick={logOut}>Sair</button>
        </div>
      )}
      <h2>Usuários</h2>
      <div className="container">
        <label>email:</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="seu e-mail"
        ></input>

        <label>senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
          }}
          placeholder="sua senha"
        ></input>

        <button onClick={novoUsuario}>Cadastrar</button>

        <button onClick={logIn}>Entrar</button>
      </div>
      <hr />

      <h2>Cadastro de posts</h2>
      <div className="container">
        <label>Título:</label>
        <input
          type="text"
          placeholder="título"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
          }}
        ></input>
        <label>Autor:</label>
        <input
          type="text"
          placeholder="nome do autor"
          value={autor}
          onChange={(e) => {
            setAutor(e.target.value);
          }}
        ></input>
        <label>ID do post: </label>
        <input
          placeholder="digite o id do post"
          value={idPost}
          onChange={(e) => {
            setIdPost(e.target.value);
          }}
        ></input>

        <button onClick={enviarForm}>cadastrar</button>

        <button onClick={exibirDB}>Exibir banco de dados</button>

        <button onClick={editarPost}>Editar post</button>

        <ul>
          {post.map((post) => {
            return (
              <li key={post.id}>
                <p>id: {post.id}</p>
                <p>título: {post.titulo}</p>
                <p>autor: {post.autor}</p>
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
