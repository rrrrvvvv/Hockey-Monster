# Hockey-Monster

This is a micropayment enabled fantasy hockey helped that uses Express, Node, Mongo, and D3. Upon paying the fee, the user will get customized fantasy hockey recommendations

This service takes player from the NHL API, reads them into MONGO, and then performs calculations on them to assign them scores based on how well they have performed, for a given league setting

These scores are then displayed in a D3 visualization

Currently, there is no fantasy hockey service that takes into account specific league settings, so this one would be a first.
