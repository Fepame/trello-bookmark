import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { addTypenameToDocument } from 'apollo-utilities';

const generatePath = () => "organizations?token=d2a458be144dbcb2e8ed01d0b95c2a274dbe70873f8ceaa1a6180ddaf9487495&key=e9d4b0061c2ac9a0529240b09d88521c"

const GetTeams = gql`
  query ($test: String!) {
    teams @rest(type: "Teams", path: $test
    ) {
      displayName
      id
    }
  }
`;

const Teams = () => (
  <Query query={GetTeams} variables={{ test: generatePath() }}>
    {({ loading, error, data }) => {
      if (loading) return null
      if (error) return `Error!: ${error}`

      return <ul>
        {data.teams.map(team => <li key={team.id}>{team.displayName}</li>)}
      </ul>
    }}
  </Query>
)

export default Teams