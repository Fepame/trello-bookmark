import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { addTypenameToDocument } from 'apollo-utilities';

const Query = gql`
  query {
    teams @rest(type: "Teams", path: 
        "organizations?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c",
    ) {
      displayName
      id
    }
  }
`;

class Teams extends Component {
  render() {
    const { loading, error, teams } = this.props;
    if (loading) {
      return <h4>Loading...</h4>;
    }
    if (error) {
      return <h4>{error.message}</h4>;
    }
    return <ul>
      {teams.map(team => <li key={team.id}>{team.displayName}</li>)}
    </ul>;
  }
}
export default graphql(Query, {
  props: ({ data }) => {
    if (data.loading) {
      return {
        loading: data.loading,
      };
    }

    if (data.error) {
      return {
        error: data.error,
      };
    }
    return {
      teams: data.teams,
      loading: false,
    };
  },
})(Teams);
