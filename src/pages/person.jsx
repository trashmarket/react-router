import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouteMatch, useLocation, useHistory } from 'react-router-dom';
import styles from './page.module.css';
import { wrapper } from './person-page.module.css';
import PersonInfo from '../components/person-info';
import { Breadcrumbs } from '../components/breadcrumbs';
import { isContainRoute } from '../services/breadcrumbs';
import { getCountriesRequest, getLaureatesRequest } from '../services/api';

// import { loadLaureates } from '../services/api';

export const PersonPage = () => {
  const [person, setPerson] = useState(null);
  const { personId } = useParams();
  const { url, path } = useRouteMatch();
  const { state } = useLocation();
  const history = useHistory();

  const loadLaureateInfo = useCallback(
    () => {
      getLaureatesRequest().then(laureates => {
        setPerson(laureates.find(({ id }) => id === personId));
      });
    },
    [personId]
  );

  useEffect(
    () => {
      loadLaureateInfo();
    },
    [personId, loadLaureateInfo]
  );

  useEffect(
    () => {
      if (person && person.firstname && person.surname && state && !isContainRoute(state, url)) {
        const personBreadcrumb = { path, url, title: `${person.firstname} ${person.surname}` };
        history.replace({ state: [...state, personBreadcrumb] });
      }
    },
    [person, path, url, state, history]
  );

  return (
    <div className={wrapper}>
      <div className={styles.container}>
        <Breadcrumbs />
        {person ? <PersonInfo person={person} /> : null}
      </div>
    </div>
  );
};