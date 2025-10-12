import React from 'react';

const NotAuthorized = () => {
  return (
        <div class="container-fluid">
            <div class="d-flex flex-column min-vh-100 py-5 px-3">
                <div class="row justify-content-center my-auto">
                    <div class="col-xl-8">
                        <div class="text-center">
                            <div class="row pt-3 justify-content-center">
                                <div class="col-md-7">
                                    <img src="/assets/images/maintenance.png" class="img-fluid" alt="" />
                                </div>
                                </div>
                            <h3 class="mt-5">Access Denied</h3>
                            <p class="text-muted pb-4">You are not authorized to access this page.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default NotAuthorized;