import Axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import Spinner from '../../../Containers/Spinner/Spinner'
// import ShowPost from '../../Posts/ShowPost/ShowPost'
import './Profile.css'
export class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            posts: [],
            isloading: false,
            error: {
                message: '',
                code: ''
            },
        }
    }

    componentDidMount() {
        let path = this.props.match.path
        let id = this.props.match.params.id

        this.setState(pre => ({
            isloading: true
        }))
        const storedData = JSON.parse(localStorage.getItem('profileData'));

        if (!storedData && path === "/profile") {
            this.props.history.push("/createProfile")
        }

        if (id) {
            Axios.get('/profile/' + id).then(data => {
                this.setState({ ...this.state.user, user: data.data.profile, isloading: false });
                return Axios.get('/profile/' + id + '/mypost')
            }).then(data => {
                this.setState({ ...this.state.posts, posts: data.data.post, isloading: false });
            }).catch(e => {
                this.setState({
                    isloading: false,
                    error: {
                        ...this.state.error, message: e.response.data.message,
                        code: e.response.status
                    }
                });

            })
        }
        else {
            let id
            Axios.get('http://localhost:4000/profile/viewprofile').then(data => {
                id = data.data.profile.username
                this.setState({ ...this.state.user, user: data.data.profile, isloading: false });

                Axios.get('http://localhost:4000/profile/' + id + '/mypost').then(data => {
                    this.setState({ ...this.state.posts, posts: data.data.post, isloading: false });
                })
            }).catch(e => {
                this.setState({
                    isloading: false,
                    error: {
                        ...this.state.error, message: e.response.data.message,
                        code: e.response.status
                    }
                });
            })


        }
    }

    render() {
        const storedData = JSON.parse(localStorage.getItem('profileData'));
        let path = this.props.match.path
        let isLoading
        let iserror

        if (this.state.isloading) {

            isLoading = (
                <>
                    <div className="container loading">
                        <div className="mar-20">
                            {/* <Spinner /> */}
                        </div>
                    </div>
                </>
            )
        }

        if (this.state.error.code) {
            iserror = (
                <>
                    <div className="container error container-short">
                        <div className="mar-20">
                            <h5>Error Code - {this.state.error.code}</h5>
                            <h4>Error Message - {this.state.error.message}</h4>
                        </div>
                    </div>
                </>
            )
        }

        // let fetchedposts
        // if (this.state.posts) {
        //     fetchedposts = this.state.posts.map((post, index) => (
        //         <ShowPost key={index} {...post} {...index} />
        //     ))
        // }
        let profile = this.state.user

        return (
            <>
                {isLoading}
                {iserror}
                {profile.username}
                <div className="container py-5 container-short">
                   


                </div>

            </>
        )
    }
}

export default Profile
